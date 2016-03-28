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
  
  # глобальный запрос + данные для автокомплитера
  field :globalQuery,      type: String
  field :globalQueryData,  type: String
  field :providerSelected, type: String

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

  def self.active( current_user, with_images = false )
    documents = self.where( archived: false )
    # documents = documents.where( provider_id: current_user['provider_id'] ) if current_user['provider_id']
    documents = self.with_images( documents ) if with_images
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

  def calculate(data)
    return Core::Reports::ElasticReport.find_or_initialize_by(report_id: self.id.to_s).calculate(data)
  end
  
  def elastic_report
    Core::Reports::ElasticReport.where(report_id: self.id.to_s).first
  end

  def populate( data )
    data.each do |table| 
      id    = table.id
      cells = table.data

      doc  = Nokogiri::HTML( Base64.decode64(self.body) )
      rows = doc.css("table\#'#{ id }'] > tbody > tr")

      # details = rows.each_with_index do |row|
      #   detail = {}
      #   [
      #     [:title, 'td[3]/div[1]/a/text()'],
      #     [:name, 'td[3]/div[2]/span/a/text()'],
      #     [:date, 'td[4]/text()'],
      #     [:time, 'td[4]/span/text()'],
      #     [:number, 'td[5]/a/text()'],
      #     [:views, 'td[6]/text()'],
      #   ].each do |name, xpath|
      #     detail[name] = row.at_xpath(xpath).to_s.strip
      #   end
      #   detail
      # end
    end
  end

end
