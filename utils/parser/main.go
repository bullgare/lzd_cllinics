package main

import (
	"io/ioutil"
	"strings"
	"flag"
	"fmt"
	"regexp"
	"encoding/json"
)

var filepath string

type Clinics struct {
	ID		int		`json:"id"`
	Name		string		`json:"name"`
	Address		string		`json:"address"`
	Chain		string		`json:"chain"`
	Coords		[]float64	`json:"coords"`
	Home		bool		`json:"home"`
	Dental		bool		`json:"dental"`
	Hours		string		`json:"hours"`
	Phones		string		`json:"phones"`
	PhonesHome	string		`json:"phones_home"`
	PhonesDental	string		`json:"phones_dental"`
	Position	string		`json:"position"`
}

func init() {
	// example with short version for long flag
	flag.StringVar(&filepath, "path", "", "file path")
}

func main() {
	flag.Parse()
	println(filepath)

	lines, err := readLines(filepath)
	if err != nil {
		panic(err)
	}

	clinicsDescs := linesToClinicsDesc(lines)

	var clinics []Clinics
	for i, cd := range clinicsDescs {
		c := parse(cd, i)
		if len(c.Address) > 0 {
			clinics = append(clinics, c)
		}
	}

	js, err := json.Marshal(clinics)
	if err != nil {
		panic(err)
	}
	// @debug
	fmt.Printf("\n\n------bububu: %s\n\n", js)
}

var (
	rePosition = regexp.MustCompile(`^\d+\.\d+`)
	reName = regexp.MustCompile(`^\d+\.\d+\.(.*?)Адрес:`)
	reAddr = regexp.MustCompile(`Адрес: [\s,\d]+? (.*?)Телефон`)
	rePhone = regexp.MustCompile(`Телефон регистратуры:(.*)`)
	rePhoneHome = regexp.MustCompile(`Телефон вызова врача на дом:(.*)`)
	rePhoneDental = regexp.MustCompile(`Телефон стоматологии:(.*)`)
)

func parse(in string, i int) Clinics {
	var c Clinics
	var matches []string

	c.ID = i
	c.Position = rePosition.FindString(in)
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

	switch string([]rune(c.Position)[0])+string([]rune(c.Position)[1]) {
	case "1.":
		c.Home = true
	case "3.":
		// nothing is provided
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
		c.Dental = true
	case "13":
		// nothing is provided
	}

	return c
}

func readLines(path string) ([]string, error) {
	content, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("Cannot read file `%s`", path)
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
