# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'jasmine', :jasmine_url => "http://localhost:8888/" do
  watch(%r{spec/javascripts/spec\.(js\.coffee|js|coffee)$})         { "spec/javascripts" }
  watch(%r{spec/javascripts/.+_spec\.(js\.coffee|js|coffee)$})
  watch(%r{src/(.+?)\.(js\.coffee|js|coffee)$})  { |m| "spec/javascripts/#{m[1]}_spec.#{m[2]}" }
end
