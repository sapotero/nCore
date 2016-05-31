# -*- encoding: utf-8 -*-

Settings::Web::Application.routes.draw do

  mount Classifiers::Engine => "/"
  mount Common::Engine => "/"
  
  devise_for :users
  
  authenticated :user do
    root to: "static#index", as: :authenticated_root
  end
  root to: redirect('/users/sign_in')

  resources :sources
  
  get  '/documents/autocomplete',  to: 'documents#autocomplete' #,as: :document_autocomplete
  get  '/documents/providers',     to: 'documents#providers'
  get  '/documents/type',          to: 'documents#type'
  post '/documents/:id/calculate', to: 'documents#calculate'

  resources :documents do
    post :remove
  end

  resources :webforms
  
  # resources :forms
  # resources :queries

  get '/groups/journal', to: 'groups#journal'
  resources :groups,  only: [:index]
  resources :members, only: [:index]
end
