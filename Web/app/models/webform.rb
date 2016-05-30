class Webform

  include Mongoid::Document
  include Mongoid::Timestamps

  # belongs_to User
  field :author_id,   type: String
  field :provider_id, type: String

  field :name,        type: String
  field :description, type: String
  field :action,      type: String

  field :archived,    type: Boolean, default: false

  # body и preview лежат в GridFs
  field :body_id
  field :image_id

  index ( { _id:  1 } )
  index ( { name: 1 } )
  
  # default_scope order_by({_id: 1})
  def self.active( current_user )
    self.where( user_id: current_user, archived: false )
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
    forms = self.where( provider_id: provider )
    forms = forms.where( template: false )
    forms
  end

  def self.with_images( forms )
    new_docs = []
    
    forms.each do |document|
      document['img'] = ( document.image_id.nil? ? '' : document.image )
      new_docs.push( document )
    end
    new_docs
  end

end
