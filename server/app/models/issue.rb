class Issue
  include DataMapper::Resource
  property :id,           Serial
  property :title,        String,:length=>1000
  property :status,	String
  property :link, 	String,:length=>500,   :required => true
  property :created_at,	DateTime, :required => false
  
  belongs_to :participant
  has n, :comments, :required => false
  has n, :criterias, :required => false

  def find_num_previous_comments
    return Comment.count(:issue_id=>id);
  end
  #select all participants who are not participating in this thread
  def find_all_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    command = "SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid});"
    potentials = adapter.select(command)
    return potentials
  end


  #randomly selects 10 participants between 100 experienced members who are not participating in this thread
  def find_experienced_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid}) ORDER BY experience DESC;")
    potentials = Array.new
    indx = 0	
    res.each do |p_id|
      potentials = potentials.to_a.push p_id
      indx = indx + 1
      break if indx == 100
    end			
    return potentials.sample(10)
  end
  
  #randomly selects 10 participants between 100 who have participated in threads that reached consensus
  def find_consensus_potential_participants
    adapter = DataMapper.repository(:default).adapter
    issueid = Issue.first(:link => link).id
    res = adapter.select("SELECT t1.participant_id, COUNT(t2.status) AS cb FROM (networks AS t1 INNER JOIN issues AS t2 ON t1.issue_id=t2.id) WHERE (t2.status LIKE 'closed%' OR t2.status LIKE 'fix%') AND t1.participant_id IN (SELECT id FROM participants WHERE NOT EXISTS (SELECT participant_id, issue_id FROM networks WHERE networks.participant_id=participants.id AND networks.issue_id=#{issueid})) GROUP BY t1.participant_id ORDER BY cb DESC;")
    indx = 0
    potentials = Array.new
    res.each do |row|
      potentials = potentials.to_a.push row[0]
      indx = indx + 1
      break if indx == 10
    end			

    return potentials#.sample(10)
  end
end

#inner Join: select t1.participant_id from networks as t1 inner join issues as t2 on t1.issue_id=t2.id;
#select consensus ones:  select t1.participant_id from (networks as t1 inner join issues as t2 on t1.issue_id=t2.id) where t2.status like "closed%" or t2.status like "fix%";
#select num consensus and participant id: select t1.participant_id, count(t2.status) from (networks as t1 inner join issues as t2 on t1.issue_id=t2.id) where t2.status like "closed%" or t2.status like "fix%" group by t1.participant_id;

#result: select t1.participant_id, count(t2.status) as cb from (networks as t1 inner join issues as t2 on t1.issue_id=t2.id) where (t2.status like "closed%" or t2.status like "fix%") and t1.issue_id <> 100 group by t1.participant_id order by cb desc;

#select id from participants where not exists (select participant_id, issue_id from networks where networks.participant_id=participants.id and networks.issue_id=100) into outfile './participants.txt';

