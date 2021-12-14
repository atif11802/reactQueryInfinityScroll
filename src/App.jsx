import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

const fetchRepository = async (page = 1) => {
	const response = await fetch(
		`https://api.github.com/search/repositories?q=topic:reactjs&per_page=30&page=${page}`
	);
	// console.log(response);
	return response.json();
};

function App() {
	const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
		"repositories",
		({ pageParam = 1 }) => fetchRepository(pageParam),
		{
			getNextPageParam: (lastPage, allPages) => {
				const maxPages = lastPage.total_count / 30;
				const nextPage = allPages.length + 1;
				return nextPage <= maxPages ? nextPage : undefined;
			},
		}
	);

	// console.log(data, hasNextPage, fetchNextPage());
	useEffect(() => {
		let fetching = false;
		const onScroll = async (e) => {
			const { scrollTop, scrollHeight, clientHeight } =
				e.target.scrollingElement;
			// console.log(scrollTop, scrollHeight, clientHeight);
			if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
				fetching = true;
				if (hasNextPage) await fetchNextPage();

				fetching = false;
			}
		};

		document.addEventListener("scroll", onScroll);
		return () => {
			document.removeEventListener("scroll", onScroll);
		};
	}, []);
	return (
		<main>
			<h1>Infinte scroll</h1>
			<ul>
				{data?.pages?.map((page) =>
					page.items.map((repo) => (
						<li key={repo.id}>
							<p>
								<b>{repo.name}</b>
							</p>
							<p>{repo.description}</p>
						</li>
					))
				)}
			</ul>
		</main>
	);
}

export default App;
