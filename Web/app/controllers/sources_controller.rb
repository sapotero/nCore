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


  def new
    @source = Source.new
  end

  def create
    @source = Source.new(source_params)

    if @source.save
      redirect_to @source, notice: 'Source was successfully created.'
    else
      render :new
    end
  end

  def update
    if @source.update(source_params)
      redirect_to @source, notice: 'Source was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @source.destroy
    redirect_to sources_url, notice: 'Source was successfully destroyed.'
  end

end
