class WebformsController < ApplicationController
  before_filter :set_form, only: [ :show, :create, :update, :delete ]
  skip_before_filter :verify_authenticity_token, if: :json_request_and_logged_in?
  respond_to :json

  def index
    forms = Webform.active( current_user._id ) rescue []
    render :json => forms;
  end


  def show
    data = []

    if @document
      data        = @document.as_json
      data[:body] = @document.body
    end

    render json: data
  end

  def new
    @document = Webform.new
  end

  def create
    data = []

    if @document
      @document = Webform.new({
        :author_id   => params[ :author_id ]   || '',
        :provider_id => params[ :provider_id ] || '',
        :name        => params[ :name ]        || '',
        :description => params[ :description ] || '',
        :action      => params[ :action ]      || '',
      })

      data = @document.save ? @document : { error: @document.error }
    end

    render :json => data
  end

  def update
    data = []

    if @document
      @document.body        = params[ :body ]        unless params[ :body ].blank?
      @document.image       = params[ :image ]       unless params[ :image ].blank?
      @document.name        = params[ :name ]        unless params[ :name ].blank?
      @document.description = params[ :description ] unless params[ :description ].blank?
      @document.action      = params[ :action ]      unless params[ :action ].blank?
      data = @document.save ? @document : { error: @document.error }
    end

    render :json => data
  end

  def delete
    data = []

    if @document
      @document.archived = true
      data = @document.save ? @document : { error: @document.error }
    end

    render :json => data
  end

  private

    def json_request_and_logged_in?
      request.format.json? || user_signed_in?
    end

    def set_form
      @document = Webform.find(params[:id]) rescue []
    end

    def redirect_to_root
      
    end

    def form_params
      params[:webform]
    end
end
