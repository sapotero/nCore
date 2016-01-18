# encoding: utf-8
JournalType.create(:full_title => "Входящие документы", :name => 'incoming_documents') unless JournalType.where(:full_title => "Входящие документы").size > 0
JournalType.create(:full_title => "Исходящие документы", :name => 'outgoing_documents') unless JournalType.where(:full_title => "Исходящие документы").size > 0
JournalType.create(:full_title => "Приказы", :name => 'orders') unless JournalType.where(:full_title => "Приказы").size > 0
JournalType.create(:full_title => "Нормативные правовые акты", :name => 'incoming_orders') unless JournalType.where(:full_title => "Нормативные правовые акты").size > 0
JournalType.create(:full_title => "Обращения граждан", :name => 'citizen_requests') unless JournalType.where(:full_title => "Обращения граждан").size > 0

p = Provider.first || Provider.create
JournalType.all.each{ |j| p.journal_types << j }
p.save

journal = JournalType.where(full_title: 'Входящие документы').first
Classifiers::Simples::DocumentType.all.each do |document_type|
DocumentType.create(full_title: document_type.name, journal_type_id: journal.id) unless DocumentType.where(full_title: document_type.name, journal_type_id: journal.id).count > 0
end unless journal.nil?

journal = JournalType.where(full_title: 'Исходящие документы').first
['Исходящий документ', 'Указание', 'Поручение'].each do |document_type|
DocumentType.create(full_title: document_type, journal_type_id: journal.id) unless DocumentType.where(full_title: document_type, journal_type_id: journal.id).count > 0
end unless journal.nil?

journal = JournalType.where(full_title: 'Приказы').first
Classifiers::OrderType.all.each do |document_type|
DocumentType.create(full_title: document_type.name, journal_type_id: journal.id) unless DocumentType.where(full_title: document_type.name, journal_type_id: journal.id).count > 0
end unless journal.nil?

journal = JournalType.where(full_title: 'Нормативные правовые акты').first
Classifiers::Simples::NpaType.all.each do |document_type|
DocumentType.create(full_title: document_type.name, journal_type_id: journal.id) unless DocumentType.where(full_title: document_type.name, journal_type_id: journal.id).count > 0
end unless journal.nil?

journal = JournalType.where(full_title: 'Обращения граждан').first
['Обращение гражданина', 'Карточка приёма'].each do |document_type|
DocumentType.create(full_title: document_type, journal_type_id: journal.id) unless DocumentType.where(full_title: document_type, journal_type_id: journal.id).count > 0
end unless journal.nil?


for i in 1..3 do
Report.create(:full_title => "Отчет#{i}", :provider_id => Provider.first.id) unless Report.where(:full_title => "Отчет#{i}").size > 0
end
