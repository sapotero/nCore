class QueriesController < ApplicationController
  before_filter :set_query, only: [:show, :edit, :update, :destroy]

  protect_from_forgery except: [ :create ]

  def show
  end

  def new
    @query = Query.new
  end

  def edit
  end

  def create
    # ap params[:data]
    # ap params[:customCells]

    return_array = Core::Reports::ElasConstructor.new( params )
    return_array.count

    render :json => return_array.results

  end

  def update
    if @query.update(query_params)
      redirect_to @query, notice: 'Query was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @query.destroy
    redirect_to queries_url, notice: 'Query was successfully destroyed.'
  end

  private
    def set_query
      @query = Query.find(params[:id])
    end

    def query_params
      params[:data]
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
