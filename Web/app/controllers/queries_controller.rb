class QueriesController < ApplicationController
  before_filter :set_query, only: [:show, :edit, :update, :destroy]
  # before_filter :cors_preflight_check
  # after_filter  :cors_set_access_control_headers
  protect_from_forgery except: [ :index, :create ]

  # GET /queries
  def index
    
    # for test
    @groups = {
      :ap                               => 'Администрация Президента РФ',
      :government                       => 'Правительство РФ',
      :gos_duma                         => 'Совет Федерации и Государственная Дума Федерального Собрания Российской Федерации',
      :ministry_direction               => 'Руководство министерства',
      :organization_head                => 'Начальники подразделения (организации)',
      :organization_deputy_head         => 'Заместитель начальника подразделения (организации)',
      :separated_organization_direction => 'Руководство самостоятельного структурного подразделения',
      :ovd_head                         => 'Начальники органов внутренних дел',
      :ovd_deputy_head                  => 'Заместитель начальника органа внутренних дел',
      :structural_subdivision_head      => 'Начальники структурного подразделения ОВД',
      :executive_organization           => 'Органы исполнительной власти субъекта Российской Федерации',
      :legislature_organization         => 'Орган законодательной (представительной) власти субъекта Российской Федерации',
      :mass_media                       => 'Средства массовой информации',
      :manager                          => 'Руководитель'
    }
    render :json => @groups
  end

  # GET /queries/1
  def show
  end

  # GET /queries/new
  def new
    @query = Query.new
  end

  # GET /queries/1/edit
  def edit
  end

  # POST /queries
  def create
    ap params[:data]
    ap params[:customCells]

    return_array = Core::Reports::ElasConstructor.new( params )
    return_array.count

    render :json => { table: return_array.results, customCells: [] }

  end

  # PATCH/PUT /queries/1
  def update
    if @query.update(query_params)
      redirect_to @query, notice: 'Query was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /queries/1
  def destroy
    @query.destroy
    redirect_to queries_url, notice: 'Query was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_query
      @query = Query.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def query_params
      params[:data]
    end

    # test localhost
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
