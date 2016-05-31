class WebformsController < ApplicationController
  skip_before_filter :verify_authenticity_token, if: :json_request_and_logged_in?

  before_filter :set_form, only: [ :show, :create, :update, :delete ]
  
  respond_to :json

  def index
    render :json => Webform.active( current_user._id );
  end


  def show
    data = []

    if @form
      data        = @form.as_json
      data[:body] = @form.body
    end

    render json: data
  end

  def new
    @form = Webform.new
  end

  def create
    data = []

    @form = Webform.new({
      :author_id   => current_user._id,
      :provider_id => current_user.provider_id,
      :name        => params[ :name ]        || '',
      :description => params[ :description ] || '',
      :action      => params[ :action ]      || '',
    })

    @form.body  = params[ :body ]  unless params[ :body ].blank?
    @form.image = params[ :image ] unless params[ :image ].blank?


    data = @form.save ? @form : { error: @form.error }

    render :json => data
  end

  def update
    data = []

    if @form
      @form.body        = params[ :body ]        unless params[ :body ].blank?
      @form.image       = params[ :image ]       unless params[ :image ].blank?
      @form.name        = params[ :name ]        unless params[ :name ].blank?
      @form.description = params[ :description ] unless params[ :description ].blank?
      @form.action      = params[ :action ]      unless params[ :action ].blank?
      data = @form.save ? @form : { error: @form.error }
    end

    render :json => data
  end

  def delete
    data = []

    if @form
      @form.archived = true
      data = @form.save ? @form : { error: @form.error }
    end

    render :json => data
  end

  private

    def json_request_and_logged_in?
      request.format.json? || user_signed_in?
    end

    def set_form
      @form = Webform.find( params[:id] ) rescue []
    end

    def form_params
      params[:webform]
    end
end
