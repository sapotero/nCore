class QueriesController < ApplicationController

  protect_from_forgery except: [ :create ]

  def new
    @query = Query.new
  end


  def create
    puts "params: #{params}"
    return_array = Core::Reports::ElasConstructor.new( params )
    return_array.count

    render :json => return_array.results
  end

end
