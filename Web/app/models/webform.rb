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
  def self.active( user_id )
    self.where( author_id: user_id )
  end

  def body=(base64)
    file = StringIO.new(base64)
    self.body_id = Mongoid::GridFs.put(file).id
  end

  def body
    Mongoid::GridFs.get(body_id).data rescue ''
  end

  def image=(canvas)
    file = StringIO.new(canvas)
    self.image_id = Mongoid::GridFs.put(file).id
  end

  def image
    Mongoid::GridFs.get(image_id).data rescue ''
  end

  def self.by_provider( provider )
    forms = self.where( provider_id: provider )
    forms = forms.where( template: false )
    forms
  end

  def self.with_images( user_id )
    forms_with_image = []

    forms = self.where( author_id: user_id )

    forms.each do |form|
      form['image'] = ( form.image_id.nil? ? '' : form.image )
      forms_with_image.push( form )
    end

    forms_with_image
  end

end
