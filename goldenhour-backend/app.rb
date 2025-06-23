require 'sinatra/base'
require 'sinatra/cross_origin'
require 'json'
require_relative 'config/database'
require_relative 'models/sun_record'
require_relative 'services/sun_data_fetcher'

class SunriseSunsetApp < Sinatra::Base
  register Sinatra::CrossOrigin

  configure do
    enable :cross_origin
  end

  before do
    content_type :json
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
  end

  options "*" do
    200
  end

  get '/sun_data' do
    location = params['location']
    start_date = params['start_date']
    end_date = params['end_date']

    halt 400, { error: 'Parâmetros em falta' }.to_json if [location, start_date, end_date].any? { |p| p.nil? || p.strip.empty? }

    begin
      fetcher = SunDataFetcher.new(location, start_date, end_date)
      data = fetcher.fetch_data

      if data.is_a?(Hash) && data[:error]
        halt 422, { error: data[:error] }.to_json
      end

      { data: data.map(&:as_json) }.to_json
    rescue => e
      puts "[ERRO BACKEND] #{e.message}"
      halt 500, { error: 'Erro interno no servidor.' }.to_json
    end
  end

  set :port, 9292
  run! if app_file == $0

end
