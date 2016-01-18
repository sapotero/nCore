# Be sure to restart your server when you modify this file.

if Rails.env == "production" || !ENV["DEVELOPER_SED"].blank? 
 	Settings::Web::Application.config.session_store :cookie_store, key: '_sed-web_session', domain: Common::Service.domain 
 else 
 	Settings::Web::Application.config.session_store :cookie_store, key: '_sed-web_session' 
 end


# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# Settings::Web::Application.config.session_store :active_record_store
