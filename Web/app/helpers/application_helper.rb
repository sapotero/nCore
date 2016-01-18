module ApplicationHelper

  def print_subordination_tree(subordination, type, root_ids)
    result = ''
    subordination.keys.each do |org_id|
      if type != 'list' or (type == 'list' and @subdivision.subordination_tree.has_key?(org_id))
        result += '<li class="accordion-group">' + "\n"
        result += '<div class="accordion-heading">' + "\n"
        result += link_to(subdivisions_path(subdivision: { uid: @organizations[org_id].id, full_title: @organizations[org_id].full_title, short_title: @organizations[org_id].short_title }), method: :post, remote: true, data: { dismiss: 'modal' }, class: 'btn pull-right') { '<i class="icon-arrow-right"></i>'.html_safe } if type == 'add'
        result += '<a href="#' + "#{type}" + '-collapse-' + "#{org_id}" + '" class="accordion-toggle" data-toggle="collapse" style="display:inline-block;margin-right:0;padding-right:0">'
        result += '<i class="icon-chevron-down"></i> ' unless subordination[org_id].nil?
        check_box = check_box_tag "subordination_tree[#{org_id}]", 1, @subdivision.subordination_tree.has_key?(org_id), class: 'is-include' if type == 'edit'
        result += '</a> ' + "#{check_box}" + ' <a href="#' + "#{type}" + '-collapse-' + "#{org_id}" + '" class="accordion-toggle" data-toggle="collapse" style="display:inline-block;margin-left:0;padding-left:0"> ' if type == 'edit'
        result += "#{@organizations[org_id].short_title}" + '</a>' + "\n"
        result += '</div>' + "\n"
        unless subordination[org_id].nil?
          result += '<div class="accordion-body '
          result += 'in ' if root_ids.include? org_id
          result += 'collapse" id="' + "#{type}" + '-collapse-' + "#{org_id}" + '">'
          result += '<div class="accordion-inner">'
          result += '<ul>'
          result += print_subordination_tree(subordination[org_id], type, root_ids)
          result += '</ul>'
          result += '</div>' + "\n" + '</div>' + "\n"
        end
        result += '</li>' + "\n"
      end
    end
    result.html_safe
  end

  def error_message(f, attribute)
    if f.object.errors.messages.include?(attribute)
      content_tag :label, class: 'message text-error' do
        f.object.errors.messages[attribute].first
      end
    end
  end

end
