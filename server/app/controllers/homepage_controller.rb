class HomepageController < ApplicationController
	skip_before_filter :verify_authenticity_token
	@@data = Rails.root.to_s+'/input.json'


	def postcomments
		render :nothing => true
		input =ActiveSupport::JSON.decode(params[:commentInfos])
		processInput(input)
	end
	
	def processInput(input)
		input.each do |curr|
			a = Participant.first_or_create({:user_name => curr["author"]},{
				:user_name => curr["author"],
				:link => curr["authorLink"]
			})
			comment = Comment.first_or_create({:title => curr["title"]},{
				:title => curr["title"],
				:link => curr["link"],
				:content => curr["content"],
				:participant => a
			})
			#comment.raise_on_save_failure = true
			#comment.save
			#tmp_file = "#{Rails.root}/out.txt"
			#File.open(tmp_file, 'wb') do |f|
			#	f.write a.id
			#end
		end
	end

	def input
		#render :json => @data, :callback =>params[:callback]
		send_file(@@data,
  			:filename => "input",
  			:type => "application/json")
	end
end
