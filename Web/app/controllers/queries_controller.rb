class QueriesController < ApplicationController

  protect_from_forgery except: [ :create ]

  def new
    @query = Query.new
  end


  def create
    elastic_report_result = Core::Reports::ElasticReportManager.make_report(params )
    render :json => elastic_report_result
  end

end
