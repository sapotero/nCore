# -*- encoding: utf-8 -*-
namespace :elastic_search do
  desc "update mappings for elastic search"
  task :update, [] => :environment do
    Core::Tasks::Db::UpdateMappings.perform
  end
end
