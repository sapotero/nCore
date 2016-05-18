class Webform

  include Mongoid::Document
  include Mongoid::Timestamps

  # belongs_to User
  field :author_id,   type: String
  field :provider_id, type: String

  field :name,        type: String
  field :description, type: String

  # body и preview лежат в GridFs
  field :body_id
  field :image_id

  index ( { _id:  1 } )
  index ( { name: 1 } )
  
  # default_scope order_by({_id: 1})

  def author
    # переделать на ошс?
    # Core::OshsMvd::Official.find( author_id ) unless author_id.blank?
    User.find( author_id ) unless author_id.blank?
  end

  def self.autocomplete( current_user, search_params = {} )
    query = active( current_user )
    query = query.where( provider_id: current_user['provider_id'] ) if current_user['provider_id']
    query = query.where( name: /#{Regexp.escape(search_params[:term])}/i ) unless search_params[:term].blank?
    query = query.order_by( created_at: -1 )
    query
  end

  def self.find_templates( with_images = false )
    documents = self.where( template: true )
    documents = self.with_images( documents ) if with_images
    documents
  end

  def body=(base64)
    file = StringIO.new(base64)
    self.body_id = Mongoid::GridFs.put(file).id
  end

  def body
    Mongoid::GridFs.get(body_id).data
  end

  def image=(canvas)
    file = StringIO.new(canvas)
    self.image_id = Mongoid::GridFs.put(file).id
  end

  def image
    Mongoid::GridFs.get(image_id).data
  end

  def self.by_provider( provider )
    documents = self.where( provider_id: provider )
    documents = documents.where( template: false )
    documents
  end

  def self.with_images( documents )
    new_docs = []
    
    documents.each do |document|
      document['img'] = ( document.image_id.nil? ? '' : document.image )
      new_docs.push( document )
    end
    new_docs
  end

end
