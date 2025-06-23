class CreateSunRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :sun_records do |t|
      t.string :location
      t.date :date
      t.time :sunrise
      t.time :sunset
      t.time :civil_twilight_begin
      t.time :civil_twilight_end
      t.float :latitude
      t.float :longitude
      t.timestamps
    end

    add_index :sun_records, [:location, :date], unique: true
  end
end
