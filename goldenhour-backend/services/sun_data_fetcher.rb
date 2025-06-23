require 'net/http'
require 'json'
require 'uri'
require 'time'

class SunDataFetcher
  SUN_API_URL = "https://api.sunrise-sunset.org/json"
  GEOCODE_API_URL = "https://nominatim.openstreetmap.org/search"

  @@geocode_cache = {} 

  def initialize(location, start_date, end_date)
    @location = location
    @start_date = Date.parse(start_date)
    @end_date = Date.parse(end_date)
  end

  def fetch_data
    coordinates = geocode_location(@location)
    return { error: "Localização inválida ou não encontrada." } unless coordinates

    results = []

    (@start_date..@end_date).each do |date|
      existing = SunRecord.find_by(location: @location, date: date)
      if existing
        results << existing
        next
      end

      uri = URI("#{SUN_API_URL}?lat=#{coordinates[:lat]}&lng=#{coordinates[:lng]}&date=#{date}&formatted=0")
      response = Net::HTTP.get_response(uri)

      unless response.is_a?(Net::HTTPSuccess)
        puts "[ERRO] Falha na requisição para #{date}: #{response.code}"
        next
      end

      json = JSON.parse(response.body)

      unless json["status"] == "OK"
        puts "[ERRO] API externa retornou erro para #{date}: #{json['status']}"
        next
      end

      data = json["results"]

      record = SunRecord.create!(
        location: @location,
        date: date,
        latitude: coordinates[:lat],
        longitude: coordinates[:lng],
        sunrise: Time.parse(data["sunrise"]).utc,
        sunset: Time.parse(data["sunset"]).utc,
        civil_twilight_begin: Time.parse(data["civil_twilight_begin"]).utc,
        civil_twilight_end: Time.parse(data["civil_twilight_end"]).utc
      )

      results << record
    end

    results
  rescue => e
    puts "[ERRO GERAL] #{e.message}"
    { error: "Erro ao obter dados." }
  end

  private

  def geocode_location(location_name)
    key = location_name.strip.downcase

    return @@geocode_cache[key] if @@geocode_cache.key?(key)

    uri = URI(GEOCODE_API_URL)
    uri.query = URI.encode_www_form({ q: location_name, format: 'json', limit: 1 })

    res = Net::HTTP.get_response(uri)
    return nil unless res.is_a?(Net::HTTPSuccess)

    data = JSON.parse(res.body)
    return nil if data.empty?

    coordinates = { lat: data.first["lat"].to_f, lng: data.first["lon"].to_f }
    @@geocode_cache[key] = coordinates

    coordinates
  rescue => e
    puts "[ERRO] Geocodificação falhou: #{e.message}"
    nil
  end
end
