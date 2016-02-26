class Document

  include Mongoid::Document
  include Mongoid::Timestamps

  # belongs_to User
  field :author,      type: String
  
  field :type,        type: String
  field :name,        type: String
  field :description, type: String
  field :type,        type: String
  field :datetime,    type: String
  field :query,       type: String
  field :periodStart, type: String
  field :periodEnd,   type: String
  field :archived,    type: Boolean, default: false
  field :globalQuery, type: String

  # годовой отчет: год по которому считать/ год с каким сравнивать
  field :yearReport,  type: Boolean, default: false
  field :main,        type: Integer, default: Date.current.year
  field :compare,     type: Integer, default: 1.year.ago.year
  
  field :body_id
  field :image_id

  # шаблон, редактировать нельзя, только создавать новые на его основе
  field :template,    type: Boolean, default: false

  # досутпные всем
  field :global,      type: Boolean, default: false


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

   def self.active()
    new_docs = []
    Document.where( archived: false ).each { |doc| new_docs.push ({ params: doc, image: ( doc.image_id.nil? ? '' : doc.image) }) }
    # Document.where( archived: false ).each { |doc| new_docs.push ( doc ) }
    new_docs
  end
end
