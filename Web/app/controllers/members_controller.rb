class MembersController < ApplicationController

  def index
    @members = Core::Groups::Member.where(group_id: params[:group_id], provider_id: current_user.provider_id ).to_a
    respond_to do |format|
      format.html
      format.json { render json: @members }
    end
  end

end
