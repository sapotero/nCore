class FormsController < ApplicationController
  before_filter :set_form, only: [:show, :edit, :update, :destroy]

  protect_from_forgery except: [ :index, :create, :edit, :update, :destroy ]

  # GET /forms
  def index
    render :json => Form.all
  end

  # GET /forms/1
  def show
    form = @form.as_json
    form[:body] = @form.body
    render json: form
  end

  # GET /forms/new
  def new
    @form = Form.new
  end

  # GET /forms/1/edit
  def edit
  end

  # POST /forms
  def create
  # "id"          => "2185457754439679",
  # "type"        => "report",
  # "name"        => "кен",
  # "description" => "кенн",
  # "datetime"    => "1450430530928",
  # "body"
  # "author"      => "AuthorName",

    @form = Form.new({
      :type        => params[ :type ],
      :name        => params[ :name ],
      :description => params[ :description ],
      :datetime    => params[ :datetime ],
      :body        => params[ :body ]
    })

    if @form.save
      render :json => @form
    else
      render :json => { error: @form.error }
    end
  end

  # PATCH/PUT /forms/1
  def update
    ap params
    @form.body = params[ :body ]
    if @form.update({
      :type        => params[ :type ],
      :name        => params[ :name ],
      :description => params[ :description ],
      :datetime    => params[ :datetime ],
      :body        => params[ :body ]
    })
      render :json => @form
    else
      render :json => { error: @form.error }
    end
  end

  # DELETE /forms/1
  def destroy
    @form.destroy
    redirect_to forms_url, notice: 'Form was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_form
      @form = Form.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def form_params
      params[:form]
    end
end
