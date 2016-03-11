class Document

  include Mongoid::Document
  include Mongoid::Timestamps

  # belongs_to User
  field :author_id,   type: String
  field :provider_id, type: String

  field :type,        type: String
  field :name,        type: String
  field :description, type: String
  
  field :periodStart, type: String
  field :periodEnd,   type: String
  field :datetime,    type: String

  field :orientation, type: String
  field :dimensions,  type: Hash
  

  field :query,       type: String
  field :archived,    type: Boolean, default: false
  field :globalQuery, type: String

  # кому доступен для редактирования
  field :editors,     type: Array

  # годовой отчет: год по которому считать/ год с каким сравнивать
  field :yearReport,  type: Boolean, default: false
  field :main,        type: Integer, default: Date.current.year
  field :compare,     type: Integer, default: 1.year.ago.year
  
  # body и preview лежат в GridFs
  field :body_id
  field :image_id

  # шаблон, редактировать нельзя, только создавать новые на его основе
  field :template,    type: Boolean, default: false

  # досутпные всем
  field :global,      type: Boolean, default: false

  def author
    # переделать на ошс?
    # Core::OshsMvd::Official.find( author_id ) unless author_id.blank?
    User.find( author_id ) unless author_id.blank?
  end

  def self.find_by_params( search_params = {} )
    query = active
    query = query.where( provider_id: User.current.provider_id )
    query = query.where( template: false )
    query = query.where( name: /#{Regexp.escape(search_params[:term])}/i ) unless search_params[:term].blank?
    query = query.order_by(created_at: -1)
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

  def self.active( with_images = false )
    documents = self.where( archived: false )
    documents = self.with_images( documents ) if with_images
    documents
  end

  def self.with_images( documents )
    new_docs = []
    documents.each { |doc| new_docs.push ({ params: doc, image: ( doc.image_id.nil? ? '' : doc.image) }) }
    # Document.where( archived: false ).each { |doc| new_docs.push ( doc ) }
    new_docs
  end
end
