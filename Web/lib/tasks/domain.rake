# -*- encoding: utf-8 -*-
namespace :db do
  desc "add services urls in database"
  task  :domain, [:domain] => :environment do |t, args|
    args.with_defaults(:domain => "esd.mvd.ru")
    domain = args.domain

    p "Installing system to <#{domain}> domain..."

    Service.delete_all
    [
      {
        :name => "incoming_documents-web",
        :code => "incoming_documents",
        :rails_app_name => "incoming_document_card_web_application",
        :namespace => "::Core::Cards::IncomingDocuments",
        :classifiers_type_code => "document_type",
        :description => "Входящие документы",
        :url => "http://incoming-documents.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::INCOMING_DOCUMENTS,
        :domain => "#{domain}",
        :sort_field => 0
      },
      {
        :name => "incoming_documents-api",
        :rails_app_name => "incoming_document_card_api_application",
        :description => "Входящие документы API",
        :url => "http://api.incoming-documents.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::INCOMING_DOCUMENTS
      },
      {
        :name => "secret_incoming_documents-web",
        :code => "secret_incoming_documents",
        :rails_app_name => "secret_incoming_document_card_web_application",
        :namespace => "::Core::Cards::SecretIncomingDocuments",
        :classifiers_type_code => "document_type",
        :description => "Входящие секретные",
        :url => "http://secret-incoming-documents.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::SECRET_INCOMING_DOCUMENTS,
        :domain => "#{domain}",
        :sort_field => 1
      },
      {
        :name => "secret_incoming_documents-api",
        :rails_app_name => "secret_incoming_document_card_api_application",
        :description => "Входящие секретные API",
        :url => "http://api.secret-incoming-documents.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::SECRET_INCOMING_DOCUMENTS
      },

      {
        :name => "outgoing_documents-web",
        :code => "outgoing_documents",
        :rails_app_name => "outgoing_document_card_web_application",
        :namespace => "::Core::Cards::OutgoingDocuments",
        :classifiers_type_code => "",
        :description => "Исходящие документы",
        :url => "http://outgoing-documents.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::OUTGOING_DOCUMENTS,
        :sort_field => 3
      },
      {
        :name => "outgoing_documents-api",
        :rails_app_name => "outgoing_document_card_api_application",
        :description => "Исходящие документы API",
        :url => "http://api.outgoing-documents.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::OUTGOING_DOCUMENTS
      },
      {
        :name => "attorney_letters-web",
        :code => "attorney_letters",
        :rails_app_name => "attorney_letter_card_web_application",
        :namespace => "::Core::Cards::AttorneyLetters",
        :classifiers_type_code => "",
        :description => "Доверенности",
        :url => "http://attorney-letters.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::ATTORNEY_LETTERS,
        :sort_field => 2
      },
      {
        :name => "attorney_letters-api",
        :rails_app_name => "attorney_letter_card_web_application",
        :description => "Доверенности API",
        :url => "http://api.attorney-letters.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::ATTORNEY_LETTERS
      },
      {
        :name => "secret_outgoing_documents-web",
        :code => "secret_outgoing_documents",
        :rails_app_name => "secret_outgoing_document_card_web_application",
        :namespace => "::Core::Cards::SecretOutgoingDocuments",
        :classifiers_type_code => "",
        :description => "Исходящие секретные",
        :url => "http://secret-outgoing-documents.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::SECRET_OUTGOING_DOCUMENTS,
        :sort_field => 4
      },
      {
        :name => "secret_outgoing_documents-api",
        :rails_app_name => "secret_outgoing_document_card_api_application",
        :description => "Исходящие секретные API",
        :url => "http://api.secret-outgoing-documents.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::SECRET_OUTGOING_DOCUMENTS
      },
      {
        :name => "orders-web",
        :code => "orders",
        :rails_app_name => "order_card_web_application",
        :namespace => "::Core::Cards::Orders",
        :classifiers_type_code => "decree_type",
        :description => "Приказы старые",
        :url => "http://orders.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::ORDERS,
        :sort_field => 5
      },
      {
        :name => "orders-api",
        :rails_app_name => "order_card_api_application",
        :description => "Приказы старые API",
        :url => "http://api.orders.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::ORDERS
      },
      {
        :name => "orders_ddo-web",
        :code => "orders_ddo",
        :rails_app_name => "order_ddo_card_web_application",
        :namespace => "::Core::Cards::OrdersDdo",
        :classifiers_type_code => "decree_type",
        :description => "Приказы",
        :url => "http://orders-ddo.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::ORDERS_DDO,
        :sort_field => 6
      },
      {
        :name => "orders_ddo-api",
        :rails_app_name => "order_ddo_card_api_application",
        :description => "Приказы API",
        :url => "http://api.orders-ddo.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::ORDERS_DDO
      },
      {
        :name => "secret_orders-web",
        :code => "secret_orders",
        :rails_app_name => "secret_order_card_web_application",
        :namespace => "::Core::Cards::SecretOrders",
        :classifiers_type_code => "decree_type",
        :description => "Приказы старые секретные",
        :url => "http://secret-orders.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::SECRET_ORDERS,
        :sort_field => 7
      },
      {
        :name => "secret_orders-api",
        :rails_app_name => "secret_order_card_api_application",
        :description => "Приказы старые секретные API",
        :url => "http://api.secret-orders.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::SECRET_ORDERS
      },
      {
        :name => "incoming_orders-web",
        :code => "incoming_orders",
        :rails_app_name => "incoming_order_card_web_application",
        :namespace => "::Core::Cards::IncomingOrders",
        :classifiers_type_code => "npa_type",
        :description => "Нормативные правовые акты",
        :url => "http://incoming-orders.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::INCOMING_ORDERS,
        :sort_field => 8
      },
      {
        :name => "incoming_orders-api",
        :rails_app_name => "incoming_order_card_api_application",
        :description => "Нормативные правовые акты API",
        :url => "http://api.incoming-orders.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::INCOMING_ORDERS
      },
      {
        :name => "secret_incoming_orders-web",
        :code => "secret_incoming_orders",
        :rails_app_name => "secret_incoming_order_card_web_application",
        :namespace => "::Core::Cards::SecretIncomingOrders",
        :classifiers_type_code => "npa_type",
        :description => "НПА секретные",
        :url => "http://secret-incoming-orders.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::SECRET_INCOMING_ORDERS,
        :sort_field => 9
      },
      {
        :name => "secret_incoming_orders-api",
        :rails_app_name => "secret_incoming_order_card_api_application",
        :description => "НПА секретные API",
        :url => "http://api.secret-incoming-orders.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::SECRET_INCOMING_ORDERS
      },
      {
        :name => "citizen_requests-web",
        :code => "citizen_requests",
        :rails_app_name => "citizen_request_card_web_application",
        :namespace => "::Core::Cards::CitizenRequests",
        :classifiers_type_code => "",
        :description => "Обращения граждан",
        :url => "http://citizen-requests.#{domain}",
        :group => Service::Groups::CARDS,
        :uid_code => Service::UidCodes::CITIZEN_REQUESTS,
        :sort_field => 10
      },
      {
        :name => "citizen_requests-api",
        :rails_app_name => "citizen_request_card_api_application",
        :description => "Обращения граждан API",
        :url => "http://api.citizen-requests.#{domain}",
        :group => Service::Groups::CARDS_API,
        :uid_code => Service::UidCodes::CITIZEN_REQUESTS
      },
      {
        :name => "decisions-web",
        :rails_app_name => "decisions_web_application",
        :description => "Резолюции",
        :url => "http://decisions.#{domain}",
        :group => Service::Groups::DECISIONS
      },
      {
        :name => "decisions-api",
        :rails_app_name => "decisions_api_application",
        :description => "Резолюции API",
        :url => "http://api.decisions.#{domain}",
        :group => Service::Groups::DECISIONS_API
      },
      {
        :name => "oshs_esd-web",
        :rails_app_name => "oshs_web_application",
        :description => "ОШС СЭД",
        :url => "http://oshs-esd.#{domain}",
        :group => Service::Groups::CLASSIFIERS
      },
      {
        :name => "oshs_esd-api",
        :rails_app_name => "oshs_api_application",
        :description => "ОШС СЭД API",
        :url => "http://api.oshs-esd.#{domain}",
        :group => Service::Groups::CLASSIFIERS_API
      },
      {
        :name => "oshs_mvd-web",
        :rails_app_name => "oshs_mvd_web_application",
        :description => "ОШС МВД",
        :url => "http://oshs-mvd.#{domain}",
        :group => Service::Groups::CLASSIFIERS
      },
      {
        :name => "oshs_mvd-api",
        :rails_app_name => "oshs_mvd_api_application",
        :description => "ОШС МВД API",
        :url => "http://api.oshs-mvd.#{domain}",
        :group => Service::Groups::CLASSIFIERS_API
      },
      {
        :name => "settings-api",
        :rails_app_name => "settings_api_application",
        :description => "Сервис взаимодействия и администрирования API",
        :url => "http://api.settings.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "settings-web",
        :rails_app_name => "settings_web_application",
        :description => "Сервис взаимодействия и администрирования",
        :url => "http://settings.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "groups-web",
        :rails_app_name => "groups_app_web_application",
        :description => "Группы",
        :url => "http://groups.#{domain}",
        :group => Service::Groups::CLASSIFIERS
      },
      {
        :name => "groups-api",
        :rails_app_name => "groups_app_api_application",
        :description => "Группы API",
        :url => "http://api.groups.#{domain}",
        :group => Service::Groups::CLASSIFIERS
      },
      {
        :name => "classifiers-web",
        :rails_app_name => "classifiers_web_application",
        :description => "Справочники",
        :url => "http://classifiers.#{domain}",
        :group => Service::Groups::CLASSIFIERS
      },
      {
        :name => "classifiers-api",
        :rails_app_name => "classifiers_api_application",
        :description => "Справочники API",
        :url => "http://api.classifiers.#{domain}",
        :group => Service::Groups::CLASSIFIERS_API
      },
      {
        :name => "control-web",
        :rails_app_name => "control_web_application",
        :description => "Контроль",
        :url => "http://control.#{domain}",
        :group => Service::Groups::CONTROL
      },
      {
        :name => "control-api",
        :rails_app_name => "control_api_application",
        :description => "Контроль API",
        :url => "http://api.control.#{domain}",
        :group => Service::Groups::CONTROL
      },
      {
        :name => "document_images-web",
        :rails_app_name => "document_image_web_application",
        :description => "Электронные образы",
        :url => "http://images.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "document_images-api",
        :rails_app_name => "document_image_api_application",
        :description => "Электронные образы API",
        :url => "http://api.images.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "logs-web",
        :rails_app_name => "log_service_application",
        :description => "Сервис журналирования",
        :url => "http://logs.#{domain}",
        :group => Service::Groups::LOGS
      },
      {
        :name => "logs-api",
        :rails_app_name => "log_service_application",
        :description => "Сервис журналирования API",
        :url => "http://api.logs.#{domain}",
        :group => Service::Groups::LOGS_API
      },
      {
        :name => "permissions-web",
        :rails_app_name => "permissions_web_application",
        :description => "Разграничение прав доступа",
        :url => "http://permissions.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "permissions-api",
        :rails_app_name => "permissions_api_application",
        :description => "Разграничение прав доступа API",
        :url => "http://api.permissions.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "registers-web",
        :rails_app_name => "registers_web_application",
        :description => "Реестры и списки",
        :url => "http://registers.#{domain}",
      },
      {
        :name => "registers-api",
        :rails_app_name => "registers_api_application",
        :description => "Реестры и списки API",
        :url => "http://api.registers.#{domain}",
      },
      {
        :name => "workstation-web",
        :rails_app_name => "workstation_web_application",
        :description => "Работа исполнителя с документами",
        :url => "http://ws.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "workstation-api",
        :rails_app_name => "workstation_api_application",
        :description => "Работа исполнителя с документами API",
        :url => "http://api.ws.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "jobs-web",
        :rails_app_name => "background_tasks_web_application",
        :description => "Фоновые задачи",
        :url => "http://jobs.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "jobs-api",
        :rails_app_name => "background_tasks_api_application",
        :description => "Фоновые задачи API",
        :url => "http://api.jobs.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "reports-web",
        :rails_app_name => "reports_web_application",
        :description => "Конструктор отчетов",
        :url => "http://reports.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "reports-api",
        :rails_app_name => "reports_api_application",
        :description => "Конструктор отчетов API",
        :url => "http://api.reports.#{domain}",
        :group => Service::Groups::OTHER
      },
      {
        :name => "mobile-api",
        :rails_app_name => "mobile_api_application",
        :description => "Мобильное приложение",
        :url => "http://api.mobile.#{domain}",
        :group => Service::Groups::OTHER
      }
    ].each { |service| Service.create(service)}
  end
end
