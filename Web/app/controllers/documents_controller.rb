class DocumentsController < ApplicationController
  before_filter :set_document, only: [:show, :edit, :update, :destroy, :remove]

  respond_to :xls, :html, :json
  protect_from_forgery except: [ :index, :create, :edit, :update, :destroy, :remove ]

  def index
    result = {}

    result['documents'] = Document.active( current_user, with_images: true )
    result['templates'] = Document.find_templates( with_images: true  )
    render :json => result
  end

  def autocomplete
    @query = Document.autocomplete( current_user, params )
    render :json => @query
  end

  def show
    document = @document.as_json
    document[:body] = @document.body
    
    

    respond_to do |format|
      format.json { render json: document }
      format.pdf  {        
        render pdf:              @document.name,
               disposition:      'attachment',
               template:         'pdf/document.pdf',
               orientation:      'Landscape',
               show_as_html:      params.key?('debug')
      }
      format.xlsx do
        render xlsx: :show, layout: false, filename: @document.name
      end

      # for test
      format.html { render :layout => false }
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
      :provider_id => params[ :provider_id ],
      :query       => params[ :query ],
      :periodStart => params[ :periodStart ],
      :periodEnd   => params[ :periodEnd ],
      :globalQuery => params[ :globalQuery ],
      :main        => params[ :main ],
      :compare     => params[ :compare ],
      :yearReport  => params[ :yearReport ],
      :globalQueryData => params[ :globalQueryData ]
    })

    if @document.save
      render :json => @document
    else
      render :json => { error: @document.error }
    end
  end

  def update
    @document.body        = params[ :body ] unless params[ :body ].blank?
    @document.image       = params[ :image ] unless params[ :image ].blank?
    @document.periodStart = params[ :periodStart ] unless params[ :periodStart ].blank?
    @document.periodEnd   = params[ :periodEnd ] unless params[ :periodEnd ].blank?
    @document.globalQuery = params[ :globalQuery ] unless params[ :globalQuery ].blank?
    @document.name        = params[ :name ] unless params[ :name ].blank?
    @document.description = params[ :description ] unless params[ :description ].blank?
    @document.query       = params[ :query ] unless params[ :query ].blank?
    @document.main        = params[ :main ] unless params[ :main ].blank?
    @document.compare     = params[ :compare ] unless params[ :compare ].blank?
    @document.yearReport  = params[ :yearReport ] unless params[ :yearReport ].blank?
    @document.globalQueryData = params[ :globalQueryData ] unless params[ :globalQueryData ].blank?
    if @document.update({
      :datetime    => params[ :datetime ]
    })
      render :json => @document
    else
      render :json => { error: @document.error }
    end
  end

  def remove
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
