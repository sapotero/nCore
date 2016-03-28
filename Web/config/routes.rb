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
  
  get '/documents/autocomplete', to: 'documents#autocomplete' #,as: :document_autocomplete
  get '/documents/providers',    to: 'documents#providers' #,as: :document_autocomplete
  

  resources :documents do
    post :remove
    post :calculate
  end
  
  # resources :forms
  # resources :queries

  resources :groups
  resources :members
end
