class CreateRepos < ActiveRecord::Migration
  def change
    create_table :repos do |t|
      t.string :url
      t.json :tree

      t.timestamps null: false
    end
  end
end
