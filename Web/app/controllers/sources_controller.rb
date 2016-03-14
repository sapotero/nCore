class SourcesController < ApplicationController

  def index
    names = []

    sources = Core::Settings::ElasticSearchField.all.to_a.group_by &:journal_type
    
    Core::Settings::Service.cards.all.to_a.each do |j|
      names.push({
        name: j.description,
        type: j.code,
        data: sources[j.code]
      })
    end
    render :json => names
  end

end
