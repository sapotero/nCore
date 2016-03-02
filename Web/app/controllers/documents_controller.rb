class DocumentsController < ApplicationController
  before_filter :set_document, only: [:show, :edit, :update, :destroy, :remove]

  protect_from_forgery except: [ :index, :create, :edit, :update, :destroy, :remove ]

  def index
    @query = Document.active( with_images: true )
    # @query.page(params[:page]).per(params[:show_count] || 10)
    render :json => @query
  end

  def autocomplete
    @query = Document.find_by_params( params )
    # @query.page(params[:page]).per(params[:show_count] || 10)
    render :json => @query
  end

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

  def new
    @document = Document.new
  end

  def edit
  end

  def create
    @document = Document.new({
      :type        => params[ :type ],
      :name        => params[ :name ],
      :description => params[ :description ],
      :datetime    => params[ :datetime ],
      :body        => params[ :body ],
      :image       => params[ :image ],
      :author_id   => params[ :author_id ],
      :query       => params[ :query ],
      :periodStart => params[ :periodStart ],
      :periodEnd   => params[ :periodEnd ],
      :globalQuery => params[ :globalQuery ],
      :main        => params[ :main ],
      :compare     => params[ :compare ],
      :yearReport  => params[ :yearReport ]
    })

    if @document.save
      render :json => @document
    else
      render :json => { error: @document.error }
    end
  end

  def update
    ap params
    @document.body        = params[ :body ]
    # @document.image       = params[ :image ]
    @document.periodStart = params[ :periodStart ]
    @document.periodEnd   = params[ :periodEnd ]
    @document.globalQuery = params[ :globalQuery ]
    @document.name        = params[ :name ]
    @document.description = params[ :description ]
    @document.query       = params[ :query ]
    @document.main        = params[ :main ]
    @document.compare     = params[ :compare ]
    @document.yearReport  = params[ :yearReport ]
    if @document.update({
      :datetime    => params[ :datetime ]
    })
      render :json => @document
    else
      render :json => { error: @document.error }
    end
  end

  def destroy
    @document.destroy
    redirect_to documents_url, notice: 'Document was successfully destroyed.'
  end

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

    def set_document
      @document = Document.find(params[:id])
    end

    def document_params
      params[:document]
    end
end
