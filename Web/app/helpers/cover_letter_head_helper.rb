# -*- encoding: utf-8 -*-
module CoverLetterHeadHelper

  def font_select_options(form, key)
    sets = Core::Settings::CoverLetterHead::FONT_RANGE.map { |f| [f, f] }
    value = form.object[key]
    options_for_select(sets, value)
  end

end