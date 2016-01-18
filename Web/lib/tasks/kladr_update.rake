# -*- encoding: utf-8 -*-
require 'csv'

namespace :kladr do
  desc 'Обновление регионов, областей, городов и улиц из xml файла'
  task :update => :environment do
    I18n.locale = :ru

    #Dir.chdir(Rails.root.join(Rails.application.config.kladr_update_dir)) do
    Dir.chdir("/home/dpankratov/fias_delta") do
      p "Используется папка: #{Dir.getwd}"
      files = Dir.glob("AS_ADDROBJ_*\.XML")
      break if files.nil? || files.length == 0

      db_version = Core::Kladr::Version.where(classifier: "Classifiers::AddressObject").desc(:version).first
      db_last_version = db_version.nil? ? nil : db_version.version

      files_for_update = {}
      files.each do |file_name|
        file_version = Core::Kladr::VersionHelper.get_version_from_filename(file_name, /AS_ADDROBJ_([0-9]+)_/)

        if file_version.nil?
          p "Версия обновления КЛАДРа не смогла определиться: #{file_name}"
          next
        end

        files_for_update[file_version] = file_name if !db_last_version.blank? && file_version > db_last_version
      end
      files_for_update.keys.sort_by{|e| e}.each do |version_str|
        if Core::Kladr::Version.where(classifier: Core::Kladr::AddressObject.to_s, :successfully_saved.ne => true).count > 0
          p "Была ошибка при загрузке предыдущих версий!"
          break
        end
        p "Применяется обновление: #{Dir.getwd + "/" + files_for_update[version_str]}"

        version = Core::Kladr::Version.create(classifier: Core::Kladr::AddressObject.to_s, version: version_str)
        Core::Kladr::Importers::AddressObjectUpdater.new(Dir.getwd + "/" + files_for_update[version_str]).update
        p "Обновление успешно применено"
        version.set_success
      end
    end
  end
end
