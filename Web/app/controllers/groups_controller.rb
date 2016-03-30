class GroupsController < ApplicationController
  
  respond_to :json
  
  def index
    respond_with Core::Groups::Group.where(:provider_id.in => [nil, current_user.provider_id], is_service: true)
  end

  def journal
    respond_with [{ name: 'Провайдеры', value: 'provider' }]
  end

end
