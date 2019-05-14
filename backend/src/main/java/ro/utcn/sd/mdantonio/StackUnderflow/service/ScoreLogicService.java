package ro.utcn.sd.mdantonio.StackUnderflow.service;

import ro.utcn.sd.mdantonio.StackUnderflow.entities.Post;
import ro.utcn.sd.mdantonio.StackUnderflow.entities.Vote;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.PostRepository;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.RepositoryFactory;
import ro.utcn.sd.mdantonio.StackUnderflow.repository.API.VoteRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.ANSWERID;
import static ro.utcn.sd.mdantonio.StackUnderflow.entities.StackUnderflowConstants.QUESTIONID;

public class ScoreLogicService {

    public static long calculateScore(RepositoryFactory repositoryFactory, int userId) {
        PostRepository postRepository = repositoryFactory.createPostRepository();
        VoteRepository voteRepository = repositoryFactory.createVoteRepository();
        List<Vote> allVotes = voteRepository.findAll();
        long userDownVotes = allVotes.stream().filter(x -> x.getUserid().equals(userId)).filter(x -> !x.isUpvote()).count();
        List<Post> postList = postRepository.findAll().stream().filter(x -> x.getAuthorid().
                equals(userId)).collect(Collectors.toList());
        long postScore = postList.stream().map(post -> {
            Optional<Vote> postVote = allVotes.stream().filter(y -> y.getPostid().equals(post.getPostid())).findFirst();
            return postVote.map(vote -> scoreLogic(post, vote)).orElse((long) 0);
        }).mapToLong(x -> ((Number) x).longValue()).sum();

        return postScore - userDownVotes;
    }

    public static long scoreLogic(Post post, Vote vote) {
        if (post.getPosttypeid().equals(QUESTIONID))
            return vote.isUpvote() ? 5 : -2;
        if (post.getPosttypeid().equals(ANSWERID))
            return vote.isUpvote() ? 10 : -2;
        return 0;
    }

    public static long calculatePostScore(RepositoryFactory repositoryFactory, Post post) {
        VoteRepository voteRepository = repositoryFactory.createVoteRepository();
        List<Vote> votes = voteRepository.findAll().stream().filter(x -> x.getPostid().equals(post.getPostid())).
                collect(Collectors.toList());
        long upVotes = votes.stream().filter(Vote::isUpvote).count();
        long downVotes = votes.stream().filter(x -> !x.isUpvote()).count();
        return upVotes - downVotes;
    }
}
