class Form

  include Mongoid::Document
  include Mongoid::Timestamps

  field :name,        type: String
  field :description, type: String
  field :type,        type: String
  field :datetime,    type: String

  field :body_id


  def body=(base64)
    file = StringIO.new(base64)
    self.body_id = Mongoid::GridFs.put(file).id
  end

  def body
    Mongoid::GridFs.get(body_id).data
  end


end
