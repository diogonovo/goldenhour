#Gemfile
require 'bundler/setup'
Bundler.require

require 'dotenv/load'

set :database, { adapter: 'sqlite3', database: 'db/development.sqlite3' }

require_relative '../models/sun_record'
require_relative '../services/sun_data_fetcher'