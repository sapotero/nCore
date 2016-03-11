# Конструктор отчётов

#### на стейдже используем gems с веткой reports_2

1) 
    - sudo apt-get install xfonts-base  xfonts-75dpi
    - sudo dpkg -i wkhtmltox-0.12.2.1_linux-wheezy-amd64.deb
    - whereis wkhtmltopdf 
    - прописать путь в /config/initializers/wicked_pdf.rb

2) rake db:seed
3) ...
4) profit!