class DocumentsController < ApplicationController
  before_filter :set_document, only: [:show, :edit, :update, :destroy, :remove]

  protect_from_forgery except: [ :index, :create, :edit, :update, :destroy, :remove ]

  # GET /documents
  def index
    render :json => Document.where( archived: false )
  end

  # GET /documents/1
  def show
    document = @document.as_json
    document[:body] = @document.body
    

    respond_to do |format|
      format.pdf  {        
        render pdf:              @document.name,
               disposition:      'attachment',
               template:         'pdf/document.pdf',
               orientation:      'Landscape',
               show_as_html:      params.key?('debug')
      }
      format.json { render json: document }
    end
    
  end

  # GET /documents/new
  def new
    @document = Document.new
  end

  # GET /documents/1/edit
  def edit
  end

  # POST /documents
  def create
    @document = Document.new({
      :type        => params[ :type ],
      :name        => params[ :name ],
      :description => params[ :description ],
      :datetime    => params[ :datetime ],
      :body        => params[ :body ],
      :author      => params[ :author ],
      :query       => params[ :query ],
      :periodStart => params[ :periodStart ],
      :periodEnd   => params[ :periodEnd ]
    })

    if @document.save
      render :json => @document
    else
      render :json => { error: @document.error }
    end
  end

  # PATCH/PUT /documents/1
  def update
    ap params
    @document.body        = params[ :body ]
    @document.periodStart = params[ :periodStart ]
    @document.periodEnd   = params[ :periodEnd ]
    @document.name        = params[ :name ]
    @document.description = params[ :description ]
    @document.query       = params[ :query ]

    if @document.update({
      :datetime    => params[ :datetime ]
    })
      render :json => @document
    else
      render :json => { error: @document.error }
    end
  end

  # DELETE /documents/1
  def destroy
    @document.destroy
    redirect_to documents_url, notice: 'Document was successfully destroyed.'
  end

  # POST /documents/1/remove
  def remove
    ap @document

    @document.archived = true

    if @document.save
      render :json => @document
    else
      render :json => { error: @document.error }
    end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_document
      @document = Document.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def document_params
      params[:document]
    end
end
