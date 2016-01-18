# -*- encoding: utf-8 -*-

Settings::Web::Application.routes.draw do

  mount Classifiers::Engine => "/"
  mount Common::Engine => "/"
  
  devise_for :users
  # root to: "static#index"

  authenticated :user do
    root to: "static#index", as: :authenticated_root
  end
  root to: redirect('/users/sign_in')

  resources :sources
  resources :documents
  resources :forms
  resources :queries

  resources :groups
  resources :members
end
