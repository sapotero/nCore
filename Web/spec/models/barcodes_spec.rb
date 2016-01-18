require 'spec_helper'

describe Barcode do
  before do
    @barcodes = Barcode.get_barcodes(count = 10)
    @barcode = @barcodes.last
  end

  context "when try to create barcode:" do

    it "should be valid" do
      @barcode.should be_valid
    end

    it "year should be now.year in 'YYY' format" do
      @barcode.year.should == Time.new.year.to_s[1..-1]
    end

    it "region should be '77' by default" do
      @barcode.region.should == '77'
    end

    it "code should be in right format: 'YYY' + region(2 digits) + number(7 digits)" do
      @barcode.code[0..2].should == Time.new.year.to_s[1..-1]
      @barcode.code[3..4].should == '77'
      @barcode.code[5..11].should =~ /^\d{7}$/
    end

    it "code should be unique" do
      Barcode.where(:code => @barcode.code).blank?.should be_true
    end

  end

  context 'When try to find presence of barcode:' do
    before do
      @barcodes = Barcode.get_barcodes(count = 30, region = 10)
      @barcodes.concat Barcode.get_barcodes(count = 30, region = 28)
      @barcodes.concat Barcode.get_barcodes(count = 30, region = 96)

      @barcodes.each {|barcode| barcode.save}
    end

    it 'check number should be valid' do
      Barcode.calculate_check_digit('013100000005').should == '6'
      Barcode.calculate_check_digit('013100000022').should == '3'
      Barcode.calculate_check_digit('013100000033').should == '9'
      Barcode.calculate_check_digit('013100000026').should == '1'
      Barcode.calculate_check_digit('013100000037').should == '7'

      Barcode.calculate_check_digit('013280000001').should == '7'
      Barcode.calculate_check_digit('013280000007').should == '9'
      Barcode.calculate_check_digit('013280000012').should == '3'
      Barcode.calculate_check_digit('013280000020').should == '8'
      Barcode.calculate_check_digit('013280000028').should == '4'

      Barcode.calculate_check_digit('013960000005').should == '6'
      Barcode.calculate_check_digit('013960000031').should == '5'
      Barcode.calculate_check_digit('013960000016').should == '2'
      Barcode.calculate_check_digit('013960000023').should == '0'
      Barcode.calculate_check_digit('013960000040').should == '7'
    end

    it 'presence of presented should be true' do

      Barcode.presence('0131000000056').should be_true
      Barcode.presence('0131000000261').should be_true

      Barcode.presence('0132800000017').should be_true
      Barcode.presence('0132800000208').should be_true

      Barcode.presence('0139600000056').should be_true
      Barcode.presence('0139600000230').should be_true
    end

    it 'presence of not existed should be false' do
      Barcode.presence('0137700000679').should be_false
      Barcode.presence('0137700000082').should be_false
      Barcode.presence('0131000000377').should be_false
      Barcode.presence('0135900000192').should be_false
    end

    it 'presence of incorrect formatted codes should be false' do
      Barcode.presence('5435345').should == 'incorrect format'
      Barcode.presence('sdsd34dg').should == 'incorrect format'
    end

    it 'presence of incorrect codes should be false' do
      Barcode.presence('0139600000044').should == 'incorrect code'
      Barcode.presence('0131000000333').should == 'incorrect code'
    end

  end


end