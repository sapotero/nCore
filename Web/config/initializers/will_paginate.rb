require 'will_paginate/array'

module WillPaginate
  module ActionView
    def will_paginate(collection = nil, options = {})
      options, collection = collection, nil if collection.is_a? Hash
      # Taken from original will_paginate code to handle if the helper is not passed a collection object.
      collection ||= infer_collection_from_controller 
      options[:renderer] ||= BootstrapLinkRenderer
      super.try :html_safe
    end

    class BootstrapLinkRenderer < LinkRenderer
      protected
      
      def html_container(html)
        tag :div, tag(:ul, html, :class => "pagination"), container_attributes
      end

      def page_number(page)
        tag :li, link(page, page, :rel => rel_value(page)), :class => ('active' if page == current_page)
      end

      def gap
        tag :li, link('&hellip;'.html_safe, '#'), :class => 'disabled'
      end

      def previous_page
        #num = @collection.current_page > 1 && @collection.current_page - 1
        num = 1
        previous_or_next_page(num, @options[:previous_label], 'previous_page')
      end
      
      def next_page
        #num = @collection.current_page < total_pages && @collection.current_page + 1
        num = total_pages
        previous_or_next_page(num, @options[:next_label], 'next_page')
      end

      def previous_or_next_page(page, text, classname)
        tag :li, link(text, page || '#'),
      :class => [(classname[0..3] if  @options[:page_links]), (classname if @options[:page_links]), ('disabled' unless page)].join(' ')
      end
    end
  end
end