import requests
from bs4 import BeautifulSoup
from typing import Tuple
import re


def scrape_wikipedia(url: str) -> Tuple[str, str]:
    """
    Scrape Wikipedia article and return clean text content and title.
    
    Args:
        url: Wikipedia article URL
        
    Returns:
        Tuple of (clean_text, title)
    """
    try:
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title_elem = soup.find('h1', {'id': 'firstHeading'}) or soup.find('h1', class_='firstHeading')
        title = title_elem.get_text().strip() if title_elem else "Unknown Title"
        
        # Find main content area
        content_div = soup.find('div', {'id': 'mw-content-text'})
        if not content_div:
            content_div = soup.find('div', class_='mw-content-ltr')
        
        if not content_div:
            raise ValueError("Could not find main content area")
        
        # Remove unwanted elements
        for element in content_div.find_all(['sup', 'table', 'div', 'span'], class_=re.compile(r'reference|navbox|infobox|thumb|toc|hatnote|mw-editsection')):
            element.decompose()
        
        # Remove script and style elements
        for script in content_div(["script", "style", "noscript"]):
            script.decompose()
        
        # Remove citation links and edit links
        for element in content_div.find_all(['a'], class_=re.compile(r'citation|external|mw-editsection')):
            element.decompose()
        
        # Get text content
        text = content_div.get_text(separator=' ', strip=True)
        
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remove very short lines (likely navigation or metadata)
        lines = text.split('\n')
        cleaned_lines = [line.strip() for line in lines if len(line.strip()) > 20]
        clean_text = ' '.join(cleaned_lines)
        
        # Limit text length to avoid token limits (keep first ~8000 characters)
        if len(clean_text) > 8000:
            clean_text = clean_text[:8000] + "..."
        
        return clean_text, title
        
    except requests.RequestException as e:
        raise ValueError(f"Failed to fetch URL: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error parsing Wikipedia article: {str(e)}")



