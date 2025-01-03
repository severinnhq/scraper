import sys
import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def search(keyword, max_results=200):
    print(f"Searching for keyword: {keyword}", file=sys.stderr)
    base_url = "https://www.google.com/search"
    results = set()  # Using a set to ensure unique URLs
    page = 0
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        while len(results) < max_results and page < 20:  # Limit to 20 pages to avoid blocking
            params = {
                "q": keyword,
                "start": page * 10,
                "num": 100  # Request more results per page
            }
            
            response = requests.get(base_url, params=params, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all search result divs
            for result in soup.find_all(['div', 'a'], class_=['yuRUbf', 'g']):
                if len(results) >= max_results:
                    break
                    
                link = result.find('a')
                if link and 'href' in link.attrs:
                    url = link['href']
                    if is_valid_url(url):
                        title = link.find('h3')
                        if title:
                            title_text = title.text
                        else:
                            title_text = url
                            
                        results.add(json.dumps({"url": url, "title": title_text}))
                        print(f"Found: {title_text} - {url}", file=sys.stderr)
            
            # Check if there are more pages
            if not soup.find('a', id='pnnext'):
                break
                
            page += 1
            time.sleep(1)  # Add delay to avoid rate limiting

    except requests.RequestException as e:
        print(f"Error during request: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)

    final_results = [json.loads(r) for r in results]
    print(f"Total unique results found: {len(final_results)}", file=sys.stderr)
    return final_results

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            keyword = sys.argv[1]
            results = search(keyword)
            print(json.dumps(results))
        else:
            print(json.dumps({"error": "Please provide a keyword as a command-line argument."}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
    sys.stdout.flush()

