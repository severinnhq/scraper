import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let lastResults: any[] = [];

export async function GET() {
  console.log('GET request received, returning last results:', lastResults);
  return NextResponse.json({ results: lastResults });
}

export async function POST(request: Request) {
  console.log('POST request received');
  try {
    const { keyword } = await request.json();
    console.log('Searching for keyword:', keyword);

    console.log('Executing Python script...');
    const { stdout, stderr } = await execAsync(`python scraper.py "${keyword}"`);
    
    if (stderr) {
      console.error('Error from Python script:', stderr);
    }

    console.log('Raw output from Python script:', stdout);

    try {
      const parsedResults = JSON.parse(stdout);
      if (Array.isArray(parsedResults)) {
        lastResults = parsedResults;
        console.log('Search completed, results:', lastResults);
        return NextResponse.json({ results: lastResults });
      } else {
        console.error('Unexpected result format:', parsedResults);
        return NextResponse.json({ error: 'Unexpected result format' }, { status: 500 });
      }
    } catch (parseError) {
      console.error('Error parsing Python script output:', parseError);
      return NextResponse.json({ error: 'Error parsing search results' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

