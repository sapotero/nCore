class SourcesController < ApplicationController
  before_filter :set_source, only: [:show, :edit, :update, :destroy]
  before_filter :cors_preflight_check
  after_filter  :cors_set_access_control_headers
  # GET /sources
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

  # GET /sources/1
  def show
  end

  # GET /sources/new
  def new
    @source = Source.new
  end

  # GET /sources/1/edit
  def edit
  end

  # POST /sources
  def create
    @source = Source.new(source_params)

    if @source.save
      redirect_to @source, notice: 'Source was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /sources/1
  def update
    if @source.update(source_params)
      redirect_to @source, notice: 'Source was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /sources/1
  def destroy
    @source.destroy
    redirect_to sources_url, notice: 'Source was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_source
      # @source = Source.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def source_params
      params[:source]
    end

    def cors_set_access_control_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
      headers['Access-Control-Max-Age'] = "1728000"
    end

    def cors_preflight_check
      if request.method == 'OPTIONS'
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version, Token'
        headers['Access-Control-Max-Age'] = '1728000'

        render :text => '', :content_type => 'text/plain'
      end
    end
end
