require 'active_record'

class SunRecord < ActiveRecord::Base
  validates :location, :date, :latitude, :longitude,
            :sunrise, :sunset, :civil_twilight_begin, :civil_twilight_end,
            presence: true

  def golden_hour_start
    civil_twilight_begin
  end

  def golden_hour_end
    civil_twilight_end
  end

  def as_json(options = {})
    {
      location: location,
      date: date,
      latitude: latitude,
      longitude: longitude,
      sunrise: sunrise.strftime("%H:%M"),
      sunset: sunset.strftime("%H:%M"),
      golden_hour_start: golden_hour_start.strftime("%H:%M"),
      golden_hour_end: golden_hour_end.strftime("%H:%M")
    }
  end
end
