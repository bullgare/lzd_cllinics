package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"unicode/utf8"
)

var (
	filepath     string
	patientsType string
)

type Clinics struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Address      string    `json:"address"`
	Chain        string    `json:"chain"`
	Coords       []float64 `json:"coords"`
	Home         bool      `json:"home"`
	Dental       bool      `json:"dental"`
	IsHospital   bool      `json:"is_hospital"`
	IsForKids    bool      `json:"is_for_kids"`
	Hours        string    `json:"hours"`
	Phones       string    `json:"phones"`
	PhonesHome   string    `json:"phones_home"`
	PhonesDental string    `json:"phones_dental"`
	Position     string    `json:"position"`
}

func init() {
	flag.StringVar(&filepath, "path", "", "file path")
	flag.StringVar(&patientsType, "patients", "adults", "write `kids` for kids")
}

func main() {
	flag.Parse()
	println(filepath)

	lines, err := readLines(filepath)
	if err != nil {
		panic(err)
	}

	clinicsDescs := linesToClinicsDesc(lines)
	errs := make([]error, 0)

	var clinics []*Clinics
	l := len(clinicsDescs)
	for i, cd := range clinicsDescs {
		c, err := parse(cd, i)
		if len(c.Address) > 0 {
			clinics = append(clinics, &c)
		}
		if err != nil {
			errs = append(errs, err)
		}
		log.Printf("%d/%d\n", i+1, l)
	}

	DetectChains(clinics)

	js, err := json.Marshal(clinics)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("\n\n%s\n\n", js)

	if len(errs) > 0 {
		log.Fatalf("Errors (%d): %v", len(errs), errs)
	} else {
		log.Print("Worked fine, no errors")
	}
}

var (
	rePosition = regexp.MustCompile(`^\d+\.\d+`)
	reName     = regexp.MustCompile(`^\d+\.\d+\.(.*?)Адрес:`)
	reAddr     = regexp.MustCompile(`Адрес: [\s,\d]*? ?(.*?)(Телефон|$)`)

	rePhone       = regexp.MustCompile(`Телефон регистратуры:(.*)`)
	rePhoneHome   = regexp.MustCompile(`Телефон вызова врача на дом:(.*)`)
	rePhoneDental = regexp.MustCompile(`Телефон стоматологии:(.*)`)
)

func parse(in string, i int) (Clinics, error) {
	var c Clinics
	var matches []string

	c.IsForKids = (patientsType == "kids")

	c.ID = i
	if c.IsForKids {
		c.ID = i + 200
	}

	c.Position = rePosition.FindString(in) + "." + patientsType
	if matches = reName.FindStringSubmatch(in); len(matches) > 0 {
		c.Name = strings.TrimSpace(matches[1])
	}

	if matches = reAddr.FindStringSubmatch(in); len(matches) > 0 {
		c.Address = strings.TrimSpace(matches[1])
	}

	if matches = rePhone.FindStringSubmatch(in); len(matches) > 0 {
		c.Phones = strings.TrimSpace(matches[1])
	}
	if matches = rePhoneDental.FindStringSubmatch(c.Phones); len(matches) > 0 {
		c.Phones = strings.TrimSuffix(c.Phones, matches[0])
	}
	if matches = rePhoneHome.FindStringSubmatch(c.Phones); len(matches) > 0 {
		c.Phones = strings.TrimSuffix(c.Phones, matches[0])
	}

	if matches = rePhoneHome.FindStringSubmatch(in); len(matches) > 0 {
		c.PhonesHome = strings.TrimSpace(matches[1])
	}
	if matches = rePhoneDental.FindStringSubmatch(c.PhonesHome); len(matches) > 0 {
		c.PhonesHome = strings.TrimSuffix(c.PhonesHome, matches[0])
	}

	if matches = rePhoneDental.FindStringSubmatch(in); len(matches) > 0 {
		c.PhonesDental = matches[1]
	}

	if c.IsForKids {
		setParamsByPositionKids(&c, string([]rune(c.Position)[0])+string([]rune(c.Position)[1]))
	} else {
		setParamsByPosition(&c, string([]rune(c.Position)[0])+string([]rune(c.Position)[1]))
	}

	coords, err := GetCoordsForAddress(c.Address)
	if err != nil {
		return c, fmt.Errorf("could not get coords for position %s", c.Position)
	} else {
		c.Coords = coords
	}

	return c, nil
}

// usual clinics - for adults
func setParamsByPosition(c *Clinics, position string) {
	switch position {
	case "1.":
	// nothing is provided
	case "2.":
	// nothing is provided
	case "3.":
		c.Home = true
	case "4.":
		c.Home = true
	case "5.":
		c.Home = true
	case "6.":
		c.Home = true
	case "7.":
		c.Home = true
	case "8.":
		c.Home = true
	case "9.":
		c.Home = true
	case "10":
		c.Dental = true
	case "11":
		c.Home = true
		c.Dental = true
	case "12":
		c.Home = true
		c.Dental = true
	case "13":
	// nothing is provided
	case "14":
		c.Dental = true
	case "15":
		c.IsHospital = true
	}
}
func setParamsByPositionKids(c *Clinics, position string) {
	switch position {
	case "1.":
	// nothing is provided
	case "2.":
		c.Home = true
	case "3.":
		c.Home = true
	case "4.":
		c.Home = true
		c.Dental = true
	case "5.":
		c.Home = true
		c.Dental = true
	case "6.":
		c.Home = true
		c.Dental = true
	case "7.":
		c.Home = true
		c.Dental = true
	case "8.":
		c.Home = true
		c.Dental = true
	case "9.":
		c.Home = true
		c.Dental = true
	case "10":
	// nothing is provided
	case "11":
		// nothing is provided
	}
}

func readLines(path string) ([]string, error) {
	content, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("cannot read file `%s`", path)
	}
	return strings.Split(string(content), "\n"), nil
}

var (
	reStartClinics = regexp.MustCompile(`^\d+\.\d+`)
	reStartComment = regexp.MustCompile(`^\d+\.[^\d]`)
)

func linesToClinicsDesc(in []string) []string {
	var out []string
	var desc string
	var parsingClinics bool

	for _, str := range in {
		if reStartComment.MatchString(str) {
			if len(desc) > 0 && parsingClinics {
				out = append(out, desc)
			}
			parsingClinics = false
			desc = ""
		}
		if reStartClinics.MatchString(str) {
			if len(desc) > 0 && parsingClinics {
				out = append(out, desc)
			}
			parsingClinics = true
			desc = ""
		}

		desc += "" + str
	}

	return out
}

//=============================================================================================
type Coords struct {
	coords []float64
}

var rePosInJSON = regexp.MustCompile(`"pos":"([\d\. ]+)"`)

func (c *Coords) UnmarshalJSON(data []byte) error {
	str := string(data)
	matches := rePosInJSON.FindStringSubmatch(str)
	if len(matches) != 2 {
		return fmt.Errorf("should have 1 `pos` in json, got %d: %v", len(matches)-1, matches)
	}
	coords := strings.Split(matches[1], " ")
	if len(coords) != 2 {
		return fmt.Errorf("should have 2 coords, got %d (%s)", len(coords)-1, matches[1])
	}
	lat, err := strconv.ParseFloat(coords[1], 64)
	if err != nil {
		return fmt.Errorf("lat (%s) is not a float64", coords[1])
	}
	lng, err := strconv.ParseFloat(coords[0], 64)
	if err != nil {
		return fmt.Errorf("lng (%s) is not a float64", coords[0])
	}
	c.coords = []float64{lat, lng}
	return nil
}

var yaURL = "https://geocode-maps.yandex.ru/1.x/?format=json&geocode="

func GetCoordsForAddress(addr string) ([]float64, error) {
	resp, err := http.Get(yaURL + addr)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	c := &Coords{}
	if err = json.Unmarshal(body, &c); err != nil {
		return nil, fmt.Errorf("unmarshal error for %s: %s", addr, err)
	}
	//// @debug
	//fmt.Printf("\n\n------bububu: %s -> %s; %s\n\n", yaURL + addr, body, c.coords)
	return c.coords, nil
}

//=======================================detecting chains
func DetectChains(list []*Clinics) {
	groupedByName := map[string][]int{}
	for i, c := range list {
		variants := getChainVariants(c.Name)
		for _, v := range variants {
			existing, ok := groupedByName[v]
			if !ok {
				existing = []int{}
			}
			existing = append(existing, i)
			groupedByName[v] = existing
		}
	}

	chainsWithIds := map[string][]int{}
	for name, ids := range groupedByName {
		if len(ids) < 3 {
			continue
		}
		chainsWithIds[name] = ids
	}

	//for name, ids := range chainsWithIds {
	//	log.Printf("%s: %v", name, ids)
	//}
	//log.Println("------------")
	chainsWithIds = stripDuplicates(chainsWithIds)
	//for name, ids := range chainsWithIds {
	//	log.Printf("%s: %v", name, ids)
	//}

	for name, ids := range chainsWithIds {
		for _, id := range ids {
			if list[id].Chain != "" {
				log.Fatalf("Tried to set chain %s to clinic that alresdy has a chain: %v", name, list[id])
			}

			list[id].Chain = name
		}
	}
}

// generates all possible variants of chain name by clinic name
func getChainVariants(name string) []string {
	name = strings.Replace(name, "(", "", -1)
	name = strings.Replace(name, ")", "", -1)
	name = strings.Replace(name, ",", "", -1)
	all := strings.Split(name, " ")

	variants := []string{}
	variantsByStep := make([][]string, len(all))
	for i, token := range all {
		if len(token) == 0 {
			continue
		}
		prev := []string{}
		cur := []string{}
		if i > 0 {
			prev = variantsByStep[i-1]
		}
		for j := range prev {
			cur = append(cur, prev[j]+" "+token)
		}
		cur = append(cur, token)
		variantsByStep[i] = cur
	}

	for _, step := range variantsByStep {
		for _, v := range step {
			variants = append(variants, v)
		}
	}

	final := []string{}
	for _, v := range variants {
		low := strings.ToLower(v)
		if low == "клиника" ||
			low == "клиники" ||
			low == "клиника в" ||
			low == "клиника на" ||
			low == "автозаводской\"" ||
			low == "россии" {
			continue
		}
		if strings.HasPrefix(low, "на ") {
			continue
		}
		if strings.HasSuffix(low, " на") {
			continue
		}
		if utf8.RuneCountInString(v) <= 7 {
			continue
		}
		final = append(final, v)
	}
	//if name == "АО \"Группа компаний \"Медси\" на Дубининской" {
	//	log.Printf("%#v", variants)
	//	panic("!")
	//}
	return final
}

// here we find the longest suffix string with maximum number of clinics
// we know that one clinic is only in one chain
func stripDuplicates(chainsWithIds map[string][]int) map[string][]int {
	names := []string{}
	lens := []int{}

	for name := range chainsWithIds {
		names = append(names, name)
	}

	sort.Slice(names, func(i, j int) bool {
		return len(names[i]) < len(names[j])
	})

	for _, name := range names {
		lens = append(lens, len(chainsWithIds[name]))
	}

	// filtering simple duplicates for names that are wrappers for other names
	// we find the max name that has these clinics
	// (we assume that one clinic is in one chain only)
	duplicates := map[int]bool{}
	filtered := map[string][]int{}
	for i1, n1 := range names {
		nameThatFits := n1
		indexThatFits := i1
		if duplicates[i1] {
			continue
		}
		for i2 := i1 + 1; i2 < len(names); i2++ {
			n2 := names[i2]
			// if we have longer name that fits, use it
			if strings.Contains(n2, nameThatFits) {
				if lens[i2] >= lens[indexThatFits] {
					nameThatFits = n2
					indexThatFits = i2
				} else {
					duplicates[i2] = true
				}
			} else if strings.Contains(nameThatFits, n2) {
				duplicates[i2] = true
			}
		}
		filtered[nameThatFits] = chainsWithIds[nameThatFits]
	}

	// we know that one clinic can be in several chains - filtering by maximum clinics number
	clinicChains := map[int]map[string]int{}
	for name, ids := range chainsWithIds {
		for _, id := range ids {
			if _, ok := clinicChains[id]; !ok {
				clinicChains[id] = map[string]int{}
			}
			clinicChains[id][name] = len(filtered[name])
		}
	}

	duplicateNames := map[string]bool{}

	for _, chains := range clinicChains {
		if len(chains) < 2 {
			continue
		}

		maxClinics := 0
		biggestChainName := ""
		for name, quantity := range chains {
			if quantity > maxClinics {
				maxClinics = quantity
				biggestChainName = name
			}
		}
		if biggestChainName == "" {
			continue
		}

		for name := range chains {
			if name != biggestChainName {
				duplicateNames[name] = true
			}
		}
	}

	unique := map[string][]int{}
	for name, ids := range filtered {
		if !duplicateNames[name] {
			unique[name] = ids
		}
	}

	return unique
}
