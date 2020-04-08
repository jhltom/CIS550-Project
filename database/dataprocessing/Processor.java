import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import com.google.gson.*;
public class Processor {
	public static void main(String[] args) {
		try {
			InputStream is = new FileInputStream("/Users/ZhongyangZhuang/eclipse-workspace/550Project/src/train.json");
			BufferedReader buf = new BufferedReader(new InputStreamReader(is));
			String line = buf.readLine();
			StringBuilder sb= new StringBuilder();
			while(line != null) {
				sb.append(line).append("\n");
				line = buf.readLine();
			}
			String fileAsString = sb.toString();
			Gson gson = new Gson();
			Cuisine[] cuisineArray = gson.fromJson(fileAsString, Cuisine[].class);
			HashSet<String> cuisineSet = new HashSet<>();
			for(Cuisine c: cuisineArray) {
				if(c.cuisine.equals("cajun_creole")) {
					c.cuisine = "cajun";
				}
				if(c.cuisine.equals("southern_us")) {
					c.cuisine = "southern";
				}
				cuisineSet.add(c.cuisine);
			}
			// Dishes
			List<Dishes> dishList = new ArrayList<>();
			for(Cuisine c: cuisineArray) {
				if(c.cuisine.equals("cajun"))	dishList.add(new Dishes(c.id, "Cajun/Creole"));
				else	dishList.add(new Dishes(c.id, c.cuisine.substring(0, 1).toUpperCase() + c.cuisine.substring(1)));
			}
			//System.out.println(dishList);
			FileWriter w = new FileWriter("/Users/ZhongyangZhuang/eclipse-workspace/550Project/src/dishes.csv");
			for(Dishes d: dishList) {
				w.write(d.toString() + System.lineSeparator());
			}
			w.close();
			// Ingredients
			List<Ingredients> ingreList = new ArrayList<>();
			HashMap<String, Integer> hm = new HashMap<>();
			int value = 0;
			for(Cuisine c: cuisineArray) {
				for(String s: c.ingredients) {
					if(!hm.containsKey(s) && isValid(s)) {
						hm.put(s, value);
						value++;
					}
				}
			}
			for(String s: hm.keySet()) {
				ingreList.add(new Ingredients(hm.get(s), s));
			}
			//System.out.println(ingreList);
			w = new FileWriter("/Users/ZhongyangZhuang/eclipse-workspace/550Project/src/ingredients.csv");
			for(Ingredients ingre: ingreList) {
				w.write(ingre.toString() + System.lineSeparator());
			}
			w.close();
			// MadeOf
			List<MadeOf> madeOfList = new ArrayList<>();
			for(Cuisine c: cuisineArray) {
				for(String s: c.ingredients) {
					if(hm.containsKey(s)) {
						madeOfList.add(new MadeOf(c.id, hm.get(s)));
					}					
				}
			}
			// System.out.println(madeOfList);
			w = new FileWriter("/Users/ZhongyangZhuang/eclipse-workspace/550Project/src/madeof.csv");
			for(MadeOf m: madeOfList) {
				w.write(m.toString() + System.lineSeparator());
			}
			w.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}
	public static boolean isValid(String s) {
		for(int i = 0; i < s.length(); i++) {
			if(Character.isLetter(s.charAt(i)) || s.charAt(i) == ' ' || Character.isDigit(s.charAt(i)) || s.charAt(i) == '-' || s.charAt(i) == '%') continue;
			return false;
		}
		return true;
	}
	
}
