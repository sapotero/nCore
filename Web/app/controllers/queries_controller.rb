class QueriesController < ApplicationController

  protect_from_forgery except: [ :create ]

  def new
    @query = Query.new
  end


  def create

    elastic_report = Core::Reports::ElasticReportManager.make_report(params )

    #return_array = Core::Reports::ElasConstructor.new( params )
    #return_array.count
    render :json => elastic_report
    #render :json => {}
  
  end

end
