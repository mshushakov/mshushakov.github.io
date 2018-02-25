import React from 'react';
import './Posts.css';

import api from '../api';

const Post = (props) => (
    <article className="post">
        <h3 className="post_caption">{ props.caption }</h3>
        <div className="post_content">{ props.content }</div>
        <div className="post_meta">{ props.meta }</div>
    </article>    
)

const Group = (props) => (
    <section className="group">
        <h3 className="group_caption">{ props.caption }</h3>
        { 
            props.posts.map(post => {
                return <Post key={post.id} caption={post.title} content={post.body} meta={ post.user ? `by ${post.user}` : '' } /> 
            })
        }
    </section>    
)

export default class Posts extends React.Component {

    constructor(props) {
		super(props);
        this.state = { 
            posts: [], 
            groups: [],
            isLoading: false,
            isGrouped: false,
            isSorted: false,
        };

        this.posts = [];
        this.users = {};
	}

	componentDidMount() {
		this.setState((prevState) => {
            return {
                posts: prevState.posts,
                isLoading: true,
            };
        });

        Promise.all([ api.users.get(), api.posts.get() ]).then(([ users, posts ]) => {
            users.forEach(user => this.users[user.id] = user);
            this.posts = posts;
            
            this.setState({
                posts: posts.map(post => Object.assign(post, { user: this.users[post.userId].name })),
                isLoading: false,
            });
        })
    }

    sort() {
        this.setState(() => {
            return Object.assign({}, {
                posts: this.posts.concat().sort((a, b) => a.title.localeCompare(b.title)),
                isGrouped: false,
                isSorted: true,
            });
        });
    }

    group() {
        this.setState(() => {
            const groups = {};
            this.posts.forEach(post => {
                if (!groups[post.userId]) groups[post.userId] = { id: post.userId, caption: `Posts by ${post.user}`, posts: [] };
                groups[post.userId].posts.push(post);
            });        

            return Object.assign({}, {
                groups: Object.values(groups),
                isGrouped: true,
                isSorted: false,
            });
        });
    }
    
	render() {
        return (
            <div className="posts">
                <div className="posts_navigation">
                    <span className={ (this.state.isSorted) ? '-active' : '' } onClick={ this.sort.bind(this) }>
                        Sort Alphabetically
                    </span>
                    <span className={ (this.state.isGrouped) ? '-active' : '' } onClick={ this.group.bind(this) }>
                        Group by Users
                    </span>
                </div>
                { 
                    this.state.isGrouped ? 
                        this.state.groups.map(group => 
                            <Group key={ group.id } caption={group.caption} posts={ group.posts } />
                        )     
                    : <Group caption="All Posts" posts={ this.state.posts } />  
                }
            </div>
        )
    }
}