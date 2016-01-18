require 'spec_helper'
describe PrintBarcodesController do
  let(:before_print_barcode_count) {Barcode.all.count}

  before do
    sign_in FactoryGirl.create(:user)
    get :print_page, format: :html, :page_count => 3, :region => '12'
  end

  describe "#print_page" do

    let(:barcodes_last_code) {assigns(:barcodes).last.code}

    it "should be 80 barcodes per page" do
      assigns(:barcodes).count.should == 240
    end

    it "status should be 200" do
      response.status.should == 200
    end

    it 'barcodes region should be 12' do
      assigns(:barcodes).sample.region.should == '12'
    end

    it 'barcodes should not be saved' do
      Barcode.all.count.should == before_print_barcode_count
    end

    describe '#save_printed' do
      before do
        post :save_printed, code: barcodes_last_code
      end
      it 'all barcodes should be saved' do
        Barcode.last.code.should == assigns(:barcodes).last.code
      end
    end

  end

end